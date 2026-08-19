import prisma from '../config/prisma';

export class CategoryService {
  /**
   * Fetch all categories ordered alphabetically by name
   */
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Fetch a single category by its unique slug
   */
  async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  }
}

export const categoryService = new CategoryService();
