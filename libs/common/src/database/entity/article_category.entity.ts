import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('article_category')
@Unique(['name'])
export class ArticleCategory {
  @PrimaryGeneratedColumn()
  id_article_category: number;

  @Column('varchar', { nullable: false, default: '' })
  name: string;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
