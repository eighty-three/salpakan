import { getCursorCoordinates } from '@/lib/drag';

const PieceStateReducer = (state, action) => {
  switch (action.type) {
    case 'cleanup': {
      return {
        style: null,
        isDragging: null,
        hasDropped: false
      };
    }

    case 'revertState': {
      return {
        style: { visibility: 'visible' },
        isDragging: state.isDragging,
        hasDropped: false
      };
    }

    case 'revertPosition': {
      return {
        style: { visibility: 'visible' },
        isDragging: state.isDragging,
        hasDropped: state.hasDropped
      };
    }

    case 'hidePiece': {
      return {
        style: { visibility: 'hidden' },
        isDragging: state.isDragging,
        hasDropped: state.hasDropped
      };
    }

    case 'snapToCursor': {
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
      if (!action.payload?.target?.parentNode) {
        return {
          style: null,
          isDragging: null,
          hasDropped: false
        };
      }

      const [x, y] = getCursorCoordinates(action.payload);

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
      if (!action.payload?.target?.parentNode) {
        return {
          style: null,
          isDragging: null,
          hasDropped: false
        };
      }

      const [x, y] = getCursorCoordinates(action.payload);

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
      return {
        style: state.style,
        isDragging: false,
        hasDropped: true
      };
    }
  }
};

export default PieceStateReducer;
