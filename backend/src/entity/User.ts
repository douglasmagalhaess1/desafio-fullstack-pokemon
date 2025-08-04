// backend/src/entity/User.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Define que esta classe é uma entidade do TypeORM e será mapeada para uma tabela no banco.
export class User {
  @PrimaryGeneratedColumn() // Define esta coluna como a chave primária e autoincrementável.
  id!: number; // O '!' indica que a propriedade será inicializada em outro lugar (pelo TypeORM neste caso).

  @Column({ unique: true }) // Define esta coluna como uma coluna normal e garante que os valores sejam únicos.
  username!: string;

  @Column() // Define esta coluna como uma coluna normal.
  password!: string; // A senha será armazenada aqui (criptografada, claro!).
}