import { Column, Entity } from 'typeorm';

export const FeedbackMetadataKey = 'feedback_metadata';

@Entity('feedback_metadata')
export class FeedbackMetadata {
  @Column({ primary: true })
  metadata_key: string;

  @Column({ type: 'int', default: 0 })
  totalFeedbacks: number;

  @Column({ type: 'float', default: 0 })
  averageRating: number;
}
