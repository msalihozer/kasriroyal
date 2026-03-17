import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.postsService.findAll(query);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        // Public request uses default isAdmin = false
        return this.postsService.findOne(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createPostDto: any) {
        return this.postsService.create(createPostDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: any) {
        return this.postsService.update(id, updatePostDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
