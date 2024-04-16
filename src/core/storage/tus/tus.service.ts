import { Injectable, Logger } from "@nestjs/common";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import { GCSStore } from "@tus/gcs-store";
import { Storage } from "@google-cloud/storage";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";
import { FileMetadata } from "./models/file-metadata.model";
import { IncomingMessage } from "http";

@Injectable()
export class TusService {
  private logger = new Logger("TusService");
  private readonly tusServer: Server;
  private readonly storage: Storage;

  constructor(private readonly configService: ConfigService) {
    this.logger.verbose(`Initializing Tus Server`);
    const storageDriver = this.configService.get<string>(
      "storage.storageDriver",
    );
    switch (storageDriver) {
      case "local":
        this.tusServer = new Server({
          path: "/files",
          datastore: new FileStore({ directory: "./files" }),
          namingFunction: (req, metadata) =>
            this.fileNameFromRequest(req, metadata),
        });
        break;
      case "gcs":
        this.storage = new Storage({
          keyFilename: "./src/config/18b28a233d62.json",
        });
        this.tusServer = new Server({
          path: "/files",
          datastore: new GCSStore({
            bucket: this.storage.bucket("trunk_works"),
          }),
          namingFunction: (req, metadata) =>
            this.fileNameFromRequest(req, metadata),
        });
        break;
      default:
        throw "Invalid storage driver" + storageDriver;
    }
  }

  async handle(req, res) {
    this.tusServer.handle(req, res);
  }

  private fileNameFromRequest = (
    req: IncomingMessage,
    metadata?: Record<string, string>,
  ) => {
    console.log({
      metadata,
    });
    try {
      const metadata = this.getFileMetadata(req);

      const prefix: string = uuid();

      const fileName = metadata.extension
        ? prefix + "." + metadata.extension
        : prefix;

      return fileName;
    } catch (e) {
      this.logger.error(e);

      // rethrow error
      throw e;
    }
  };

  private getFileMetadata(req: any): FileMetadata {
    const uploadMeta: string = req.header("Upload-Metadata");
    console.log({ uploadMeta });
    const metadata = new FileMetadata();

    uploadMeta.split(",").map((item) => {
      const tmp = item.split(" ");
      const key = tmp[0];
      const value = Buffer.from(tmp[1], "base64").toString("ascii");
      metadata[`${key}`] = value;
    });

    let extension: string = metadata.name
      ? metadata.name.split(".").pop()
      : null;
    extension = extension && extension.length === 3 ? extension : null;
    metadata.extension = extension;

    return metadata;
  }
}
