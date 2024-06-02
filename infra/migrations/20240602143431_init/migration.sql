-- CreateTable
CREATE TABLE "Posdcast" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "youtubeChannelId" TEXT NOT NULL,

    CONSTRAINT "Posdcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "postcastId" INTEGER NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_postcastId_fkey" FOREIGN KEY ("postcastId") REFERENCES "Posdcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--insert
INSERT INTO "Posdcast" 
("name", "youtubeChannelId")
VALUES ('Flow', 'UC4ncvgh5hFr5O83MH7-jRJg');
