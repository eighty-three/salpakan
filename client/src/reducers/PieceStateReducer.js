import { getCursorCoordinates } from '@/lib/drag';

const PieceStateReducer = (state, action) => {
  switch (action.type) {
    case 'revertState': {
      // Return the piece to its initial state
      return {
        style: { visibility: 'visible' },
        isDragging: state.isDragging,
        hasDropped: false
      };
    }

    case 'revertPosition': {
      // Removes the `transform` in style
      return {
        style: { visibility: 'visible' },
        isDragging: state.isDragging,
        hasDropped: state.hasDropped
      };
    }

    case 'hidePiece': {
      /* Purely for UX. Hides the flickering of the piece
       * when changing its position during setup.
       */
      return {
        style: { visibility: 'hidden' },
        isDragging: state.isDragging,
        hasDropped: state.hasDropped
      };
    }

    case 'snapToCursor': {
      // Sets the center of the piece's position to cursor
      return {
        style: {
          visibility: 'visible',
          transform: `translate(${action.payload.x}px, ${action.payload.y}px)`,
          'z-index': 98
        },
        isDragging: true,
        hasDropped: state.hasDropped
      };
    }

    case 'dragStart': {
      /* For when the user is still dragging the piece
       * even if it's not allowed anymore, for example,
       * if the time runs out both in game or in setup,
       * or if the opponent already surrendered
       */
      if (!action.payload?.target?.parentNode) {
        return {
          style: null,
          isDragging: null,
          hasDropped: false
        };
      }

      const [x, y] = getCursorCoordinates(action.payload);

      // Sets the center of the piece's position to cursor
      return {
        style: {
          visibility: 'visible',
          transform: `translate(${x}px, ${y}px)`,
          'z-index': 98
        },
        isDragging: true,
        hasDropped: state.hasDropped
      };
    }

    case 'dragging': {
      /* For when the user is still dragging the piece
       * even if it's not allowed anymore, for example,
       * if the time runs out both in game or in setup,
       * or if the opponent already surrendered
       */
      if (!action.payload?.target?.parentNode) {
        return {
          style: null,
          isDragging: null,
          hasDropped: false
        };
      }

      const [x, y] = getCursorCoordinates(action.payload);

      // Sets the center of the piece's position to cursor
      return {
        style: {
          visibility: 'visible',
          transform: `translate(${x}px, ${y}px)`,
          'z-index': 98
        },
        isDragging: state.isDragging,
        hasDropped: state.hasDropped
      };
    }

    case 'dropped': {
      /* Sets `hasDropped` to false which would trigger
       * useEffect for the dragged Piece, resetting its
       * state
       */
      return {
        style: state.style,
        isDragging: false,
        hasDropped: true
      };
    }
  }
};

export default PieceStateReducer;
