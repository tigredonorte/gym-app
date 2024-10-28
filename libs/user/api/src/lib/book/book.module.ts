import { DecisionStrategy, KeycloakModule, Logic } from '@gym-app/keycloak';
import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [
    KeycloakModule.forChild({
      roles: [
        { name: 'user' },
        { name: 'manager' },
        { name: 'admin' },
      ],
      scopes: [
        { name: 'view' },
        { name: 'create' },
        { name: 'edit' },
        { name: 'delete' },
      ],
      policies: [
        {
          name: 'User Owned Resource Policy',
          type: 'user',
          logic: Logic.POSITIVE,
          decisionStrategy: DecisionStrategy.UNANIMOUS,
          users: [],
        },
        {
          name: 'Organization Policy',
          type: 'js',
          logic: Logic.POSITIVE,
          decisionStrategy: DecisionStrategy.UNANIMOUS,
          // code: `
          //   // JavaScript policy code to check if the resource and user belong to the same organization
          //   var context = $evaluation.getContext();
          //   var resourceAttributes = context.getAttributes('resource');
          //   var userAttributes = context.getAttributes('user');
          //   if (resourceAttributes.containsValue('organizationId', userAttributes.getValue('organizationId'))) {
          //     $evaluation.grant();
          //   }
          // `,
        },
        {
          name: 'Admin Policy',
          type: 'role',
          logic: Logic.POSITIVE,
          decisionStrategy: DecisionStrategy.UNANIMOUS,
          // roles: [{ id: 'admin', required: true }],
        },
      ],
      permissions: [
        {
          name: 'Book Permission',
          type: 'resource',
          logic: Logic.POSITIVE,
          decisionStrategy: DecisionStrategy.UNANIMOUS,
          resources: ['book:*'],
          scopes: ['view', 'create', 'edit', 'delete'],
          policies: ['User Owned Resource Policy', 'Organization Policy', 'Admin Policy'],
        },
      ],
    }),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
