import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';
import { BookDto } from './book.dto';
import { IBook } from './book.model';
import { BookService } from './book.service';

@Controller('book')
@Resource('book')
export class BookController {

  constructor(
    private bookService: BookService,
  ) {}

  @Get('')
  @Scopes('view')
  @HttpCode(HttpStatus.OK)
  async listBooks(): Promise<IBook[] | null> {
    return await this.bookService.list();
  }

  @Get(':id')
  @Scopes('view')
  @HttpCode(HttpStatus.OK)
  async getBook(
    @Param('id') id: string,
  ): Promise<IBook | null> {
    return await this.bookService.getById(id);
  }

  @Put('')
  @Scopes('create')
  @HttpCode(HttpStatus.OK)
  async createBook(
    @Body() data: BookDto,
      @AuthenticatedUser() user: { sub: string, organizationId: string },
  ): Promise<void> {
    const userId = user.sub;
    const organizationId = user.organizationId;
    await this.bookService.create(data, userId, organizationId);
  }

  @Post(':id')
  @Scopes('edit')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
      @Body() data: BookDto
  ): Promise<IBook | null> {
    return await this.bookService.update(id, data);
  }

  @Delete('id')
  @Scopes('delete')
  @HttpCode(HttpStatus.OK)
  async cancelChangePassword(
    @Param('id') id: string,
  ): Promise<void> {
    await this.bookService.delete(id);
  }
}
