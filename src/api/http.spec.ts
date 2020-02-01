import { Http } from './http';

const xhrMockClass = () => ({
  open: jest.fn(),
  send: jest.fn(),
  readyState: 4,
  responseText: undefined,
  onload: jest.fn(),
  onerror: jest.fn(),
  setRequestHeader: jest.fn(),
});

describe('[Service]: Http', () => {
  const oldXMLHttpRequest = window.XMLHttpRequest;
  let mockXHR: any;

  beforeEach(() => {
    mockXHR = xhrMockClass() as any;
    window.XMLHttpRequest = jest.fn(() => mockXHR) as any;
  });

  afterEach(() => {
    window.XMLHttpRequest = oldXMLHttpRequest;
  });

  it('should send a get request and parse data', done => {
    const req = Http.Get<{ test: true }>('http://request.com');
    expect(mockXHR.open).toBeCalledWith('GET', 'http://request.com', true);
    mockXHR.status = 200;
    mockXHR.responseText = JSON.stringify({ test: true });
    mockXHR.onload(new ProgressEvent('load'));
    req.then(event => {
      event.json().then(data => {
        expect(data.test).toBe(true);
        done();
      });
    });
  });

  it('should convert object to params', () => {
    expect(Http.ToParams({ true: true, false: false, undefined: undefined })).toBe('?true=true&false=false');
  });
});
