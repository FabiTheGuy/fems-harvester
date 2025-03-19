import { ColumnDescription, DataType, Sequelize } from "sequelize";
import { Logger } from "./logger.js";

export class DatabaseHandler {
  private sequelize: Sequelize;
  private table: string;

  constructor(
    host: string,
    port: number,
    user: string,
    password: string,
    db: string,
    table: string,
  ) {
    this.table = table;
    this.sequelize = new Sequelize(db, user, password, {
      host: host,
      port: port,
      dialect: "postgres",
      logging: false,
      define: {
        timestamps: false,
      },
    });

    this.connect();
  }

  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      Logger.getInstance().debug("Successfully connected to the Database");
    } catch (error) {
      Logger.getInstance().error(
        `Unable to connect to the Database: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.sequelize.close();
      Logger.getInstance().debug("Successfully disconnected from the Database");
    } catch (error) {
      Logger.getInstance().error(
        `Unable to diconnect from the Database: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async createTable(
    model: Object,
    dropOnMismatch: boolean,
  ): Promise<void> {
    if (!this.modelEqualToTable(model)) {
      if (dropOnMismatch) {
        Logger.getInstance().info("The table will be dropped");
        this.sequelize.getQueryInterface().dropTable(this.table);
      }
    }
  }

  private async modelEqualToTable(
    model: Record<string, any>,
  ): Promise<boolean> {
    const table = await this.sequelize
      .getQueryInterface()
      .describeTable(this.table);

    return Object.keys(table).every(
      (key) => key in model && model[key].key === table[key].type,
    );
  }
}
