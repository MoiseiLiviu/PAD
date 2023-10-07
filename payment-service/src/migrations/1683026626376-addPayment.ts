import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayment1683026626376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE payment (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subtotal NUMERIC NOT NULL,
        transaction_id VARCHAR,
        user_id BIGINT NOT NULL,
        order_id BIGINT NOT NULL,
        status VARCHAR NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE payment;
    `);
  }
}
