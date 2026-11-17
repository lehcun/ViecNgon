import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { AiMatchService } from 'src/ai/ai-match.service';
import { GoogleCalendarService } from 'src/calender/google-calendar.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { ApplicationsService } from './applications.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: createPrismaMock() },
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
        { provide: GoogleCalendarService, useValue: { createEvent: jest.fn() } },
        { provide: AiMatchService, useValue: { evaluateAndSaveApplication: jest.fn() } },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
