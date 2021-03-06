import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import {bindActionCreators} from 'redux';
import {showImageEditor} from '../dialogs/actions';
import {editImages} from '../ImageEditor/actions';
import {block} from '../utils';
import {mapFocusProps} from './utils';


const b = block('e-table');

class ImageCell extends Component {

  static propTypes = {
    cell: PropTypes.shape({
      classMix: PropTypes.string,
      data: PropTypes.shape({
        common: PropTypes.shape({
          images: PropTypes.array
        }),
        binder: PropTypes.object
      }),
      isDragged: PropTypes.bool,
      isFocus: PropTypes.bool,
      isLast: PropTypes.bool,
      isSelected: PropTypes.bool,
      name: PropTypes.string
    }),
    editImages: PropTypes.func,
    handleCellClick: PropTypes.func,
    handleDrag: PropTypes.func,
    handleEndSelection: PropTypes.func,
    handleStartSelection: PropTypes.func,
    handleSelection: PropTypes.func,
    showImageEditor: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return !_isEqual(this.props, nextProps);
  }

  handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      this.editImages();
    }
  };

  handeDoubleClick = () => {
    this.editImages();
  };

  editImages = () => {
    if (this.props.cell.data.common.copy_images_from) {
      return;
    }
    this.props.showImageEditor();
    this.props.editImages({name: this.props.cell.name, id: this.props.cell.id});
  };

  render() {
    const {cell, handleCellClick, handleStartSelection, handleSelection, handleEndSelection, handleDrag} = this.props;
    const {isLast, isFocus, isDragged, isSelected, classMix, data} = cell;

    const src = data.common.images &&
      data.common.images.length &&
      data.common.images[0].src;
    const img = src ?
      <img src={src} alt='' className={b('img')} /> :
      <div className={b('img-empty')} />;

    return (
      <div
        tabIndex={-1}
        className={b('cell').mix(`is-${classMix}`)
          .is({
            focus: isFocus,
            selected: isSelected,
            'selected-to': isDragged
          })
        }
        onKeyDown={data.binder && this.handleKeyPress}
        onClick={data.binder && handleCellClick}
        onDoubleClick={data.binder && this.handeDoubleClick}
        ref={($td) => { $td && isFocus && $td.focus(); }}
        onMouseDown={handleStartSelection}
        onMouseEnter={handleSelection}
        onMouseUp={handleEndSelection}
        onDragStart={e => e.preventDefault}
        onSelect={e => e.preventDefault}
      >
        {img}
        {isLast &&
          <div onMouseDown={handleDrag} className={b('drag-tool')} />
        }
        {data.common.copy_images_from &&
          <div title='Выполняется копирование изображений' className={b('loader')} />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({...mapFocusProps(state.table.focus, ownProps)});

const mapDispatchToProps = dispatch => bindActionCreators({
  editImages,
  showImageEditor,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImageCell);
