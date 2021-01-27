import styles from '@/components/Game/Board/DropTarget.module.scss';

const DragReducer = (state, action) => {
  switch (action.type) {
    case 'dragStart': {
      return {
        draggable: false,
        css: `${styles.target} ${styles.top}`,
        winner: state.winner,
        setter: action.payload
      };
    }

    case 'dragEnd': {
      return {
        draggable: true,
        css: styles.target,
        winner: state.winner,
        setter: state.setter
      };
    }

    case 'update': {
      return {
        draggable: (action.payload) ? false : true,
        css: styles.target,
        winner: action.payload,
        setter: state.setter
      };
    }
  }
};

export default DragReducer;
