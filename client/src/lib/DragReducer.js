import styles from '@/components/Game/Board/DropTarget.module.scss';

const TurnChangeReducer = (state, action) => {
  switch (action.type) {
    case 'dragStart': {
      return {
        draggable: false,
        css: `${styles.target} ${styles.top}`,
        winner: state.winner
      };
    }

    case 'dragEnd': {
      return {
        draggable: true,
        css: styles.target,
        winner: state.winner
      };
    }

    case 'update': {
      return {
        draggable: (action.payload) ? false : true,
        css: styles.target,
        winner: action.payload
      };
    }
  }
};

export default TurnChangeReducer;
