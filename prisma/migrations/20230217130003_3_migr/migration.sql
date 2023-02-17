-- CreateTable
CREATE TABLE "botaccount" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "botaccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chaturl" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "user_id" INTEGER,

    CONSTRAINT "chaturl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50),
    "content" TEXT,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "repeating" TEXT DEFAULT 'Does not repeat',
    "user_id" INTEGER,
    "bot_account_id" INTEGER,
    "chaturl_id" INTEGER,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "botaccount" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chaturl" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "fk_botaccount" FOREIGN KEY ("bot_account_id") REFERENCES "botaccount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "fk_chaturl" FOREIGN KEY ("chaturl_id") REFERENCES "chaturl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
