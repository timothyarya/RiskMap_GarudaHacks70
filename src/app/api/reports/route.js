import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Report from "@/models/Report";

export async function POST(req) {
    try {
        const body = await req.json()
        await connectMongoDB()
        const newReport = await Report.create(body)

        return NextResponse.json({
            message: "Report created successfully",
            data: newReport
        }, {
            status: 201
        })
    } catch (error) {
        console.error("gagal simpan di DB", error)
        return NextResponse.json({ 
            error: "Failed to save report to database" 
        }, { 
            status: 500 
        })
    }
}

export async function GET() {
    try {
        await connectMongoDB()
        const pastNinetyMinutes = new Date(Date.now() - 90 * 60 * 1000)

        const reports = await Report.find({
            lastUpvotedAt: { $gte: pastNinetyMinutes }
        })

        return NextResponse.json(
            { message: "Risk Report fetched successfully", data: reports },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch Risk Report" },
            { status: 500 }
        )
    }
}

export async function PUT(req) {
    try {
        await connectMongoDB()
        const { reportId } = await req.json()

        await Report.findByIdAndUpdate(reportId, {
            $inc: { upvotes: 1 },
            lastUpvotedAt: Date.now()
        })

        return NextResponse.json({ message: "Sukses upvote" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Gagal upvote" }, { status: 500 })
    }
}