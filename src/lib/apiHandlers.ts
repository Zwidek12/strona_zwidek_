import {
  ACTIVITY_TYPES,
  DATE_PATTERN,
  FAKE_JWT_TOKEN,
  VALID_LOGIN_ROLE,
} from '../constants'
import type {
  ActivityType,
  ApiResponse,
  DuoRequestBody,
  LoginRequestBody,
} from '../types'

export function handleLogin(body: LoginRequestBody): ApiResponse {
  if (body.role.trim() === VALID_LOGIN_ROLE) {
    return {
      status: 200,
      statusText: 'OK',
      body: { token: FAKE_JWT_TOKEN },
    }
  }
  return {
    status: 401,
    statusText: 'Unauthorized',
    body: {
      error: 'Invalid credentials',
      message: 'Elevation denied. Sprawdź rolę w infrastrukturze.',
    },
  }
}

export function handleFactorioStatus(): ApiResponse {
  return {
    status: 409,
    statusText: 'Conflict',
    body: {
      error: 'Spaghetti code detected on the main bus.',
      recommendation:
        'Wymagana optymalizacja. Rekomendowane dodanie drugiego gracza przed przejściem do fazy Space Exploration.',
    },
  }
}

export function handleHobbies(): ApiResponse {
  return {
    status: 200,
    statusText: 'OK',
    body: {
      gym_status: 'Ready for PR',
      crochet_queue: [
        'Amigurumi z LoLa',
        'Czapka na zimę',
        'Szalik dla gracza drugiego',
      ],
      match_potential: 'Over 9000',
    },
  }
}

export function handleDuoInitialize(body: DuoRequestBody): ApiResponse {
  const isValidActivity = ACTIVITY_TYPES.includes(
    body.activityType as ActivityType,
  )
  const isValidDate = DATE_PATTERN.test(body.preferredDay.trim())

  if (!isValidActivity || !isValidDate || !body.isPlayerTwoReady) {
    return {
      status: 400,
      statusText: 'Bad Request',
      body: {
        error: 'Invalid request body',
        details: {
          activityType: isValidActivity
            ? 'OK'
            : `Must be one of: ${ACTIVITY_TYPES.join(', ')}`,
          preferredDay: isValidDate ? 'OK' : 'Format required: DD-MM-YYYY',
          isPlayerTwoReady: body.isPlayerTwoReady
            ? 'OK'
            : 'Must be true',
        },
      },
    }
  }

  return {
    status: 201,
    statusText: 'Created',
    body: {
      connectionId: crypto.randomUUID(),
      status: 'P2P handshake initiated',
      message: 'Duo session queued successfully',
    },
  }
}

export function unauthorizedResponse(): ApiResponse {
  return {
    status: 401,
    statusText: 'Unauthorized',
    body: {
      error: 'Unauthorized',
      message: 'Bearer token required. Use Authorize or POST /Auth/Login.',
    },
  }
}

export function parseJsonBody<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
