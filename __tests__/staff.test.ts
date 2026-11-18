import { can, canActOn, marketRole, peopleLabel, staffLevel } from '@/domain/admin';
import { effectiveMode, modesFor, sideMode } from '@/domain/mode';
import { needsSetup } from '@/domain/setup';
import { hasIdentity } from '@/domain/privacy';
import type { SessionUser } from '@/domain/types';

// Staff is a permission on top of a member or companion account (18 Nov).
const member = { role: 'user' as const, staffRole: null };
const companion = { role: 'companion' as const, staffRole: null };
const superMember = { role: 'user' as const, staffRole: 'superadmin' as const };
const subCompanion = { role: 'companion' as const, staffRole: 'subadmin' as const };
const legacySuper = { role: 'superadmin' as const }; // older data: staff level in role

describe('staff level', () => {
  it('reads staffRole, and the old staff value in role', () => {
    expect(staffLevel(member)).toBeNull();
    expect(staffLevel(companion)).toBeNull();
    expect(staffLevel(superMember)).toBe('superadmin');
    expect(staffLevel(subCompanion)).toBe('subadmin');
    expect(staffLevel(legacySuper)).toBe('superadmin');
  });

  it('keeps the member / companion side', () => {
    expect(marketRole(subCompanion)).toBe('companion');
    expect(marketRole(superMember)).toBe('user');
    expect(marketRole(legacySuper)).toBe('user');
  });

  it('labels every hat', () => {
    expect(peopleLabel(member)).toBe('Member');
    expect(peopleLabel(superMember)).toBe('Superadmin · Member');
    expect(peopleLabel(subCompanion)).toBe('Sub-admin · Companion');
  });

  it('admin rights follow the staff level, not the member side', () => {
    expect(can(staffLevel(superMember), 'refund')).toBe(true);
    expect(can(staffLevel(subCompanion), 'refund')).toBe(false);
    expect(can(staffLevel(subCompanion), 'verify')).toBe(true);
    expect(can(staffLevel(companion), 'verify')).toBe(false);
    // A sub-admin can't change other staff; a superadmin can change sub-admins but not superadmins.
    expect(canActOn(staffLevel(subCompanion), staffLevel(superMember) ?? 'user')).toBe(false);
    expect(canActOn(staffLevel(superMember), staffLevel(subCompanion) ?? 'companion')).toBe(true);
    expect(canActOn(staffLevel(subCompanion), staffLevel(member) ?? member.role)).toBe(true);
  });
});

describe('modes', () => {
  it('everyone books; companions add Companion; staff add Admin', () => {
    expect(modesFor(member)).toEqual(['booking']);
    expect(modesFor(companion)).toEqual(['booking', 'companion']);
    expect(modesFor(superMember)).toEqual(['admin', 'booking']);
    expect(modesFor(subCompanion)).toEqual(['admin', 'booking', 'companion']);
  });

  it('staff start in Admin and keep the mode they last chose', () => {
    expect(effectiveMode(superMember, undefined)).toBe('admin');
    expect(effectiveMode(superMember, 'booking')).toBe('booking');
    expect(effectiveMode(subCompanion, 'companion')).toBe('companion');
    // A mode they can't use falls back.
    expect(effectiveMode(superMember, 'companion')).toBe('admin');
    expect(effectiveMode(member, 'admin')).toBe('booking');
  });

  it('Admin reads as Booking on the tabs', () => {
    expect(sideMode('admin')).toBe('booking');
    expect(sideMode('companion')).toBe('companion');
  });
});

describe('setup for staff', () => {
  const base: SessionUser = { id: 's', role: 'user', staffRole: 'superadmin', is_verified: true, verification_status: 'verified', fullName: 'Owner', phone: '919000000000' };
  it('in Admin only a name is needed', () => {
    expect(needsSetup(base, 'admin')).toBe(false);
    expect(needsSetup({ ...base, fullName: '' }, 'admin')).toBe(true);
  });
  it('in Booking they answer the member questions like anyone', () => {
    expect(needsSetup(base, 'booking')).toBe(true);
    const done = { ...base, gender: 'man' as const, seeGender: 'everyone' as const, profileVisibility: 'open' as const, city: 'Hyderabad', categories: ['explore'], photoStatus: 'approved' as const };
    expect(hasIdentity(done)).toBe(true);
    expect(needsSetup(done, 'booking')).toBe(false);
  });
});
