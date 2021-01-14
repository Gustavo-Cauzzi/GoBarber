import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class AlterProviderFieldToUserId1598723813638
  implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('appointments','provider');
      await queryRunner.addColumn('appointments', new TableColumn({
        name:'provider_id',
        type: 'uuid',
        isNullable: true
      }));

      await queryRunner.createForeignKey('appointments',
        new TableForeignKey({
          name:"AppointmentProvider",
          columnNames:['provider_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete:'SET NULL',
          onUpdate:'CASCADE'
        }),
      );
    }

    // ATENÇÃO (1)
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey(
        'appointments',
        'AppointmentProvider',
      );

      await queryRunner.dropColumn(
        'appointments',
        'provider_id'
      );

      await queryRunner.addColumn('appointments', new TableColumn({
        name: 'provider',
        type: 'varchar',
        })
      )
    }

}

/*

  1 - SEMPRE QUE FOR FAZER O DOWN DE ALGO
  ASSIM, sempre fazer na ordem reversa.
    ex: não faz sentido dar um dropColumn
    primeiro, pois depois disto, como que
    vamos dar um dropForeignKey na chave
    estrangeira sendo que a coluna n existe
    mais?

*/
