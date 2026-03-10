
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    create(@Body() createCommentDto: any) {
        return this.commentsService.create(createCommentDto);
    }

    // Public endpoint to get comments for a specific entity
    @Get('public')
    findAllPublished(@Query('type') type: string, @Query('entityId') entityId: string) {
        return this.commentsService.findAllPublished(type, entityId);
    }

    // Admin endpoints
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
        return this.commentsService.findAll();
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateStatus(@Param('id') id: string, @Body('isPublished') isPublished: boolean) {
        return this.commentsService.updateStatus(id, isPublished);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
        return this.commentsService.remove(id);
    }
}
