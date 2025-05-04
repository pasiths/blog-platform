import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { postId, content } = await req.json();

        if (!postId || !content) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId: user.id,
            },
        });

        if (!comment) {
            return NextResponse.json(
                { message: "Error creating comment" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Comment created successfully", comment },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { message: "Error creating comment" },
            { status: 500 }
        );
        
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "Comment ID is required" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.userId !== user.id) {
            return NextResponse.json(
                { message: "You are not authorized to delete this comment" },
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Comment deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { message: "Error deleting comment" },
            { status: 500 }
        );
    }
}