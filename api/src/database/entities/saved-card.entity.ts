import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('saved_cards')
export class SavedCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.saved_cards)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  brand: string;

  @Column({ length: 4 })
  last_four: string;

  @Column({ name: 'exp_month', type: 'int' })
  exp_month: number;

  @Column({ name: 'exp_year', type: 'int' })
  exp_year: number;

  @Column({ length: 255 })
  cardholder_name: string;

  @Column({ name: 'is_default', default: false })
  is_default: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
