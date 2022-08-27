-- CreateTable
CREATE TABLE "Person" (
    "Id" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "Id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "OwnerId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ParticipantOnEvent" (
    "Id" SERIAL NOT NULL,
    "EventId" INTEGER NOT NULL,
    "PersonId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_Id_key" ON "Person"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "Person_Email_key" ON "Person"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_Id_key" ON "Event"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantOnEvent_Id_key" ON "ParticipantOnEvent"("Id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_OwnerId_fkey" FOREIGN KEY ("OwnerId") REFERENCES "Person"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantOnEvent" ADD CONSTRAINT "ParticipantOnEvent_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "Event"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantOnEvent" ADD CONSTRAINT "ParticipantOnEvent_PersonId_fkey" FOREIGN KEY ("PersonId") REFERENCES "Person"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
