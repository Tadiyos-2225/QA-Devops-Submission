import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import {HealthController} from './health/health.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
    }),
    UsersModule,
    ProductsModule,
    TransactionsModule
    
  ],
  providers: [AppService],
  controllers: [AppController,HealthController],
})
export class AppModule {}
