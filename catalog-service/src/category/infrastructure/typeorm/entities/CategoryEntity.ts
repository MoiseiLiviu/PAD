import { AbstractEntity } from "@pad_lab/common";
import { Column, Entity } from "typeorm";

@Entity("category")
export class CategoryEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  // @ManyToMany(() => ProductEntity, (fbsfs) => fbsfs.categories)
  // products: ProductEntity[];
}
