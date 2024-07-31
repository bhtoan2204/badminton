import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleCategory } from './article_category.entity';
import { Enclosure } from './enclosure.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id_article: number;

  @Column('int', { nullable: false, default: 1 })
  id_article_category: number;

  @Column('int', { nullable: true, default: 1 })
  id_enclosure: number;

  @Column('varchar', { nullable: false, default: '' })
  title: string;

  @Column('varchar', { nullable: false, default: '' })
  link: string;

  @Column('varchar', { nullable: false, default: '' })
  content: string;

  @Column('varchar', { nullable: false, default: '' })
  contentSnippet: string;

  @Column('varchar', { nullable: false, default: '' })
  guid: string;

  @Column('varchar', { nullable: false, default: '' })
  isoDate: string;

  @CreateDateColumn({ type: 'timestamp' })
  pubDate: Date;

  @OneToOne(() => Enclosure, { cascade: true, eager: true })
  @JoinColumn({ name: 'id_enclosure' })
  enclosure: Enclosure;

  @ManyToOne(() => ArticleCategory, (category) => category.articles)
  @JoinColumn({ name: 'id_article_category' })
  category: ArticleCategory;
}
