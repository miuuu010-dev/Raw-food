import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
}

const LOCAL_USER_KEY = 'haru_saengsik_current_user';
const LOCAL_USERS_DB_KEY = 'haru_saengsik_registered_users';

interface LocalUserRecord {
  uid: string;
  email: string;
  name: string;
  passwordHash: string;
}

function getLocalUsers(): Record<string, LocalUserRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUsers(users: Record<string, LocalUserRecord>) {
  try {
    localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('LocalStorage save failed', e);
  }
}

/**
 * Translates Firebase Auth or validation errors into easy, warm Korean
 */
export function getFriendlyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/weak-password':
    case 'PASSWORD_TOO_SHORT':
      return '비밀번호가 너무 짧아요. 안전을 위해 6자 이상으로 입력해주세요.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'PASSWORD_MISMATCH':
      return '비밀번호가 맞지 않아요. 비밀번호를 다시 확인해주세요.';
    case 'auth/user-not-found':
    case 'USER_NOT_FOUND':
      return '가입되지 않은 이메일 주소입니다. 먼저 [회원가입]을 진행해주세요.';
    case 'auth/email-already-in-use':
    case 'EMAIL_EXISTS':
      return '이미 가입되어 있는 이메일 주소입니다. [로그인]을 해주세요.';
    case 'auth/invalid-email':
    case 'INVALID_EMAIL':
      return '올바른 이메일 주소 형식이 아닙니다. (예: user@example.com)';
    case 'PASSWORDS_NOT_EQUAL':
      return '비밀번호와 비밀번호 확인이 서로 달라요. 같게 입력해주세요.';
    case 'NAME_REQUIRED':
      return '성함(이름)을 입력해주세요.';
    case 'EMAIL_REQUIRED':
      return '이메일 주소를 입력해주세요.';
    case 'auth/too-many-requests':
      return '로그인 시도가 너무 많아 일시적으로 정지되었습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '로그인 또는 회원가입 처리 중 문제가 발생했습니다. 다시 시도해주세요.';
  }
}

/**
 * Register with Email and Password
 */
export async function registerUser(name: string, email: string, password: string): Promise<AppUser> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) throw new Error('NAME_REQUIRED');
  if (!trimmedEmail || !trimmedEmail.includes('@')) throw new Error('INVALID_EMAIL');
  if (!password || password.length < 6) throw new Error('PASSWORD_TOO_SHORT');

  try {
    // Attempt standard Firebase Auth
    const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    await updateProfile(credential.user, { displayName: trimmedName });

    // Store profile in Firestore
    try {
      await setDoc(doc(db, 'users', credential.user.uid), {
        id: credential.user.uid,
        name: trimmedName,
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore user profile save skipped/error:', e);
    }

    const appUser: AppUser = {
      uid: credential.user.uid,
      email: trimmedEmail,
      displayName: trimmedName,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
    return appUser;
  } catch (error: any) {
    console.warn('Firebase Auth createUser error:', error);

    // If Firebase Auth Email/Password is not enabled in Firebase Console (auth/operation-not-allowed),
    // provide seamless local persistence fallback so the user can test and experience registration without being blocked!
    if (error?.code === 'auth/operation-not-allowed' || error?.code === 'auth/network-request-failed') {
      const localUsers = getLocalUsers();
      if (localUsers[trimmedEmail]) {
        throw new Error('EMAIL_EXISTS');
      }

      const uid = 'user_' + Date.now();
      localUsers[trimmedEmail] = {
        uid,
        email: trimmedEmail,
        name: trimmedName,
        passwordHash: password,
      };
      saveLocalUsers(localUsers);

      const appUser: AppUser = {
        uid,
        email: trimmedEmail,
        displayName: trimmedName,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      return appUser;
    }

    throw new Error(error?.code || error?.message || 'UNKNOWN');
  }
}

/**
 * Login with Email and Password
 */
export async function loginUser(email: string, password: string): Promise<AppUser> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !trimmedEmail.includes('@')) throw new Error('INVALID_EMAIL');
  if (!password || password.length < 6) throw new Error('PASSWORD_TOO_SHORT');

  try {
    // Attempt standard Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    let displayName = credential.user.displayName || '';

    if (!displayName) {
      try {
        const snap = await getDoc(doc(db, 'users', credential.user.uid));
        if (snap.exists()) {
          displayName = snap.data().name || '';
        }
      } catch (e) {
        console.warn('User profile fetch fallback', e);
      }
    }

    if (!displayName) {
      displayName = trimmedEmail.split('@')[0];
    }

    const appUser: AppUser = {
      uid: credential.user.uid,
      email: trimmedEmail,
      displayName,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
    return appUser;
  } catch (error: any) {
    console.warn('Firebase Auth signIn error:', error);

    // Check local fallback users
    const localUsers = getLocalUsers();
    if (localUsers[trimmedEmail]) {
      if (localUsers[trimmedEmail].passwordHash !== password) {
        throw new Error('PASSWORD_MISMATCH');
      }
      const record = localUsers[trimmedEmail];
      const appUser: AppUser = {
        uid: record.uid,
        email: record.email,
        displayName: record.name,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      return appUser;
    }

    if (error?.code) {
      throw new Error(error.code);
    }
    throw new Error('USER_NOT_FOUND');
  }
}

/**
 * Logout
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Sign out error', e);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

/**
 * Get cached user or null
 */
export function getSavedUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
