// Input validation schemas for game operations
export const gameSchemas = {
  move: {
    roomId: { type: 'string', required: true, minLength: 1 },
    playerId: { type: 'string', required: true, minLength: 1 },
    pawnId: { type: 'string', required: true, minLength: 1 },
    steps: { type: 'number', required: true, min: 1, max: 6 }
  },
  
  capture: {
    roomId: { type: 'string', required: true, minLength: 1 },
    striker: {
      type: 'object',
      required: true,
      properties: {
        playerId: { type: 'string', required: true },
        pawnId: { type: 'string', required: true }
      }
    },
    victim: {
      type: 'object',
      required: true,
      properties: {
        playerId: { type: 'string', required: true },
        pawnId: { type: 'string', required: true }
      }
    }
  },

  join: {
    roomId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    playerId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    playerName: { type: 'string', required: true, minLength: 1, maxLength: 100 },
    pawns: { type: 'array', required: false, maxLength: 4 }
  }
};

export function validateInput(data, schema) {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${key} is required`);
      continue;
    }
    
    if (value !== undefined) {
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${key} must be a string`);
      } else if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`${key} must be a number`);
      } else if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push(`${key} must be an array`);
      }
      
      // Additional validations
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${key} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${key} must not exceed ${rules.maxLength} characters`);
      }
      if (rules.min && value < rules.min) {
        errors.push(`${key} must be at least ${rules.min}`);
      }
      if (rules.max && value > rules.max) {
        errors.push(`${key} must not exceed ${rules.max}`);
      }
    }
  }
  
  return errors;
}
