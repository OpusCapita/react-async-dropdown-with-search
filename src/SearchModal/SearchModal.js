import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import ReactTable from 'react-table';

import './SearchModal.scss';

const REACT_TABLE_PROPS = {
  showPagination: true,

  showPaginationTop: false,
  showPaginationBottom: true,
  showPageSizeOptions: true,
  pageSizeOptions: [3, 10, 20, 50, 100],
  defaultPageSize: 10,

  manual: true,
  sortable: false,
};

const DEFAULT_STATE_VALUES = {
  searchResults: [],
  page: 0,
  pageSize: REACT_TABLE_PROPS.defaultPageSize,
  pages: 1,
  selectedRow: undefined,
  loading: true,
};

const DEFAULT_TEXTS = {
  previous: 'Previous',
  next: 'Next',
  loading: 'Loading...',
  noData: 'No rows found',
  page: 'Page',
  of: 'of',
  rows: 'rows',
  pageJump: 'jump to page',
  rowsSelector: 'rows per page',
};


class SearchModal extends Component {
  constructor(props) {
    super(props);

    const searchFields = Object.assign(
      {},
      ...props.fields.map(field => ({
        [field]: '',
      })),
    );
    this.defaultSearchFields = {
      ...searchFields,
    };
    this.fetchToken = 0;
    this.state = {
      searchFields,
      ...DEFAULT_STATE_VALUES
    };
  }

  setSearchValue = (fieldName, value) => {
    const { searchFields } = this.state;
    const newSearchFields = {
      ...searchFields,
      [fieldName]: value,
    };
    this.setState({
      searchFields: newSearchFields
    });
    this.fetchData({
      searchFields: newSearchFields,
      page: 0,
    });
  };

  selectRow = row => {
    this.setState({
      selectedRow: row,
    });
  }

  handlePageChange = page => {
    this.setState({
      page
    });
  }

  handlePageSizeChange = (pageSize, page) => {
    this.setState({
      pageSize
    });
  }

  handleSelect = () => {
    const {
      selectedRow,
    } = this.state;
    this.props.onSelect(selectedRow && selectedRow.original);
    this.handleClose();
  };

  handleClose = () => {
    this.setState({
      ...DEFAULT_STATE_VALUES,
      searchFields: this.defaultSearchFields,
    });
    this.props.onClose();
  };

  handleFetchData = () => this.fetchData();

  fetchData = state => {
    const resolvedState = {
      ...this.state,
      ...state
    };
    const {
      page,
      pageSize,
      searchFields
    } = resolvedState;
    this.fetchToken = this.fetchToken + 1;
    this.setState({ loading: true });
    Promise.resolve(this.fetchToken).then(token => {
      this.props.loadOptions({
        searchFields,
        offset: page * pageSize,
        limit: pageSize,
      }).then(({
        data,
        totalCount,
      }) => {
        if (token === this.fetchToken) {
          this.setState({
            searchResults: data.slice(0, pageSize),
            page,
            pages: Math.ceil(totalCount / pageSize),
            loading: false,
          });
        }
      });
    });
  };

  renderSearchField = ({ name: fieldName, value }, labelPrefix, key, localizationTexts, filters) => {
    if (filters && filters[fieldName]) {
      const Filter = filters[fieldName];
      return (
        <div className='combobox-with-custom-search__modal-search-filter' key={`search-field-${key}`}>
          <Filter value={value} onChange={value => this.setSearchValue(fieldName, value)}/>
        </div>
      );
    }
    const translatedPrefix = localizationTexts[labelPrefix];
    const translatedFieldName = localizationTexts[`field.${fieldName}`];
    return (
      <div className={`combobox-with-search__modal-search-filter`} key={`search-field-${key}`}>
        <label className="combobox-with-search__modal-search-label" htmlFor={`search-field-${fieldName}`}>
          {`${translatedPrefix} ${translatedFieldName}`}
        </label>
        <input
          type="text"
          id={`search-field-${fieldName}`}
          value={value}
          onInput={e => this.setSearchValue(fieldName, e.target.value)}
        />
      </div>
    );
  };

  render() {
    const {
      searchResults,
      searchFields,
      loading,
      selectedRow,
      pages,
      page,
      pageSize,
    } = this.state;
    const {
      localizationTexts,
      filters,
      renderers
    } = this.props;
    const fieldObjects = Object.entries(searchFields).map(([name, value]) => ({ name, value }));
    const columns = fieldObjects.map(({ name }) => {
      return {
        Header: localizationTexts[`column.${name}`],
        accessor: name,
        Cell: props => {
          const AdditionalComponent = renderers && renderers[props.column.id] || null;
          return (
            <div className={`cell-value cell-value-${props.original.disabled ? 'disabled' : ''}`}>
              {
                AdditionalComponent ?
                  <AdditionalComponent {...props.original}/> :
                  <span>{props.value}</span>
              }
            </div>
          );
        }
      };
    });
    const [firstField, ...otherFields] = fieldObjects;

    const texts = {
      previousText: localizationTexts.previous || DEFAULT_TEXTS.previous,
      nextText: localizationTexts.next || DEFAULT_TEXTS.next,
      loadingText: localizationTexts.loading || DEFAULT_TEXTS.loading,
      noDataText: localizationTexts.noData || DEFAULT_TEXTS.noData,
      pageText: localizationTexts.page || DEFAULT_TEXTS.page,
      ofText: localizationTexts.of || DEFAULT_TEXTS.of,
      rowsText: localizationTexts.rows || DEFAULT_TEXTS.rows,
      pageJumpText: localizationTexts.pageJump || DEFAULT_TEXTS.pageJump,
      rowsSelectorText: localizationTexts.rowsSelector || DEFAULT_TEXTS.rowsSelector,
    };

    return (
      <Modal className="combobox-with-search__modal" show={this.props.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton={true}>
          <h4>
            {this.props.title}
          </h4>
        </Modal.Header>
        <Modal.Body>
          <div className="combobox-with-search__modal-search-filters">
            {
              firstField && this.renderSearchField(
                firstField,
                'searchBy',
                `00-${firstField.name}`,
                localizationTexts,
                filters
              )
            }
            {
              otherFields.map(
                (field, i) => this.renderSearchField(
                  field,
                  'by',
                  `${i}-${field.name}`,
                  localizationTexts,
                  filters
                )
              )
            }
          </div>
          <div className="combobox-with-search__modal-search-results">
            <ReactTable
              {...REACT_TABLE_PROPS}
              {...texts}
              data={searchResults}
              columns={columns}
              pageSize={pageSize}
              loadingText={localizationTexts.loading}
              noDataText={loading ? '' : localizationTexts.noData}
              loading={loading}
              pages={pages}
              page={page}
              onFetchData={this.handleFetchData}
              onPageChange={this.handlePageChange}
              onPageSizeChange={this.handlePageSizeChange}
              getTrProps={
                (state, row) => ({
                  onClick: () => this.selectRow(row),
                  className: selectedRow && row && selectedRow.index === row.index ? "selected" : ""
                })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle="primary"
            onClick={this.handleSelect}
            disabled={!selectedRow || selectedRow.original.disabled}
          >
            {localizationTexts.select}
          </Button>
          <Button bsStyle="default" onClick={this.handleClose}>
            {localizationTexts.close}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SearchModal.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.array,
  filters: PropTypes.object,
  renderers: PropTypes.object,
  loadOptions: PropTypes.func,
  showModal: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  localizationTexts: PropTypes.object,
};

SearchModal.defaultProps = {
  title: '',
  fields: [],
  loadOptions: () => Promise.resolve({ data: [], totalCount: 0 }),
  showModal: false,
  onClose: () => {
  },
  onSelect: () => {
  },
};

export default SearchModal;
