import { Migration } from '@mikro-orm/migrations';

export class Migration20220113181412 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_created_at_check";');
    this.addSql('alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "created_at" drop not null;');
    this.addSql('alter table "user" drop constraint if exists "user_updated_at_check";');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "updated_at" drop not null;');
    this.addSql('alter table "user" drop constraint "user_shopname_unique";');
    this.addSql('alter table "user" drop column "shopname";');
  }

}
