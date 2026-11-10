import { companionStatusLine, idUploadError, isLiveCompanion, needsBack, needsIdToAccept } from '@/domain/verification';
import { stageOf } from '@/domain/booking';

describe('ID check at the first booking', () => {
  it('new companions are live before any ID', () => {
    expect(isLiveCompanion('id_required')).toBe(true);
    expect(isLiveCompanion('pending')).toBe(true);
    expect(isLiveCompanion('verified')).toBe(true);
    expect(isLiveCompanion('rejected')).toBe(false);
    expect(isLiveCompanion('not_submitted')).toBe(false);
  });

  it('asks for an ID before accepting only when none is on file', () => {
    expect(needsIdToAccept('id_required')).toBe(true);
    expect(needsIdToAccept('rejected')).toBe(true);
    expect(needsIdToAccept('pending')).toBe(false);
    expect(needsIdToAccept('verified')).toBe(false);
  });

  it('knows which IDs need a back photo', () => {
    expect(needsBack('aadhaar')).toBe(true);
    expect(needsBack('pan')).toBe(false);
    expect(needsBack('passport')).toBe(false);
  });

  it('checks the upload before sending', () => {
    expect(idUploadError(null, {})).toMatch(/Choose/);
    expect(idUploadError('aadhaar', { front: 1, selfie: 1 })).toMatch(/back/);
    expect(idUploadError('pan', { front: 1 })).toMatch(/selfie/);
    expect(idUploadError('pan', { front: 1, selfie: 1 })).toBeNull();
    expect(idUploadError('voter_id', { front: 1, back: 1, selfie: 1 })).toBeNull();
  });

  it('a held booking shows as checking, not confirmed', () => {
    expect(stageOf({ flow: 'prepaid', status: 'pending', paymentStatus: 'paid', allocation: { state: 'id_check' } })).toBe('checking');
    expect(companionStatusLine('id_required')).toMatch(/first booking/);
  });
});
