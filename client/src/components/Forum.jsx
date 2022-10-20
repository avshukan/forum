import { Container } from 'react-bootstrap';

function Forum() {
    return (
        <Container className="h-100 my-4 overflow-hidden rounded shadow">
            <Row className="p-0 h-100">
                <Col className="p-0 h-100">
                    <div className='d-flex flex-column h-100'>
                        <h1>HELLO</h1>
                        <div className='overflow-auto'>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                            <div className='m-4 p-4'>xxx</div>
                        </div>
                        <h1>BYE</h1>
                    </div>
                </Col>
            </Row>
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
        </Container>
    );
}

export default Forum;