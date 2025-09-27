// Input validation schemas for player operations
export const playerSchemas = {
  createPlayer: {
    playerId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
    pawns: { type: 'array', required: false, maxLength: 4 }
  },

  updatePlayer: {
    playerId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    name: { type: 'string', required: false, minLength: 1, maxLength: 100 }
  },

  updatePawnPosition: {
    playerId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    pawnId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    position: { type: 'number', required: true, min: 0, max: 100 }
  },

  updatePawnScore: {
    playerId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    pawnId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    score: { type: 'number', required: true, min: 0 }
  },

  pawn: {
    pawnId: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    position: { type: 'number', required: false, min: 0, max: 100 },
    score: { type: 'number', required: false, min: 0 },
    atHome: { type: 'boolean', required: false }
  }
};

export function validatePlayerInput(data, schema) {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${key} is required`);
      continue;
    }
    
    if (value !== undefined && value !== null) {
      // Type validation
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${key} must be a string`);
      } else if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`${key} must be a number`);
      } else if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push(`${key} must be an array`);
      } else if (rules.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${key} must be a boolean`);
      }
      
      // Length validations for strings and arrays
      if ((rules.type === 'string' || rules.type === 'array') && value.length !== undefined) {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${key} must be at least ${rules.minLength} characters/items`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${key} must not exceed ${rules.maxLength} characters/items`);
        }
      }
      
      // Numeric validations
      if (rules.type === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${key} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${key} must not exceed ${rules.max}`);
        }
      }
    }
  }
  
  return errors;
}

// Specialized validation functions
export function validatePawnArray(pawns) {
  if (!Array.isArray(pawns)) {
    return ['Pawns must be an array'];
  }

  if (pawns.length > 4) {
    return ['A player cannot have more than 4 pawns'];
  }

  const errors = [];
  const pawnIds = new Set();

  pawns.forEach((pawn, index) => {
    const pawnErrors = validatePlayerInput(pawn, playerSchemas.pawn);
    pawnErrors.forEach(error => {
      errors.push(`Pawn ${index + 1}: ${error}`);
    });

    // Check for duplicate pawn IDs
    if (pawn.pawnId) {
      if (pawnIds.has(pawn.pawnId)) {
        errors.push(`Pawn ${index + 1}: Duplicate pawn ID ${pawn.pawnId}`);
      }
      pawnIds.add(pawn.pawnId);
    }
  });

  return errors;
}
