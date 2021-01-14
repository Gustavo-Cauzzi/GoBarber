import {TableColumn,MigrationInterface, QueryRunner} from "typeorm";

export default class AddAvatarToFieldUsers1598820650419 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('users',new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('users','avatar');
    }

}
