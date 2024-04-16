import {
  CreateTicketInput,
  CreateTicketPayload,
} from './../../../graphql/schema.types';
import { CreateTicketMutationDocument } from '../../../graphql/mutations/generated/CreateTicket';
import mutatorFactory from './factory';

const createTicket = mutatorFactory<CreateTicketInput, CreateTicketPayload>(
  'createTicket',
  CreateTicketMutationDocument
);
export default createTicket;
