import { KeycloakResourceService, OrganizationGuard } from '@gym-app/keycloak';
import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument, IBook } from './book.model';

@UseGuards(OrganizationGuard)
@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private keycloakResourceService: KeycloakResourceService,
  ) {}

  async list(): Promise<Book[] | null> {
    return await this.bookModel.find();
  }

  async getById(id: string): Promise<Book | null> {
    return await this.bookModel.findById(id);
  }

  async create(data: IBook, userId: string, organizationId: string): Promise<Book> {
    const result = await this.bookModel.create(data);
    const bookId = result.id;

    // Register the book as a resource in Keycloak
    await this.keycloakResourceService.createResource({
      name: `book:${bookId}`,
      owner: { id: userId },
      ownerManagedAccess: true,scopes: [
        { name: 'view' },
        { name: 'create' },
        { name: 'edit' },
        { name: 'delete' },
      ],
      attributes: {
        organizationId: [organizationId],
      },
    });

    return result;
  }

  async update(id: string, data: Partial<IBook>): Promise<Book | null> {
    return await this.bookModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.bookModel.findByIdAndDelete(id);
  }
}
