import React from 'react';
import Icon from '@mdi/react';
import {
  mdiGithub, mdiGmail, mdiFacebook, mdiLinkedin,
} from '@mdi/js';

function Sidebar() {
  return (
    <div className="blog-sidebar">
      <div className="">
        <span className="sidebar-title-box">Hello There!</span>
        <ul className="list-unstyled text-center mb-0 mt-4">
          <li className="list-inline-item">
            <a href="https://github.com/avshukan" className="btn btn-icon btn-primary">
              <Icon path={mdiGithub} title="Github" size={1} />
            </a>
          </li>
          <li className="list-inline-item">
            <a href="mailto:avshukan@gmail.com" className="btn btn-icon btn-primary">
              <Icon path={mdiGmail} title="Gmail" size={1} />
            </a>
          </li>
          <li className="list-inline-item">
            <a href="https://www.facebook.com/avshukan" className="btn btn-icon btn-primary">
              <Icon path={mdiFacebook} title="Facebook" size={1} />
            </a>
          </li>
          <li className="list-inline-item">
            <a href="https://www.linkedin.com/in/avshukan/" className="btn btn-icon btn-primary">
              <Icon path={mdiLinkedin} title="Linkedin" size={1} />
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-4 pt-2">
        <span className="sidebar-title-box">Flickr</span>

        <ul className="list-unstyled gallery-grid overflow-hidden mb-0 mt-4">
          <li className="item">
            <a href="/">
              <img src="images/flickr/01.jpg" alt="img-missing" className="img-fluid" target="_blank" />
            </a>
          </li>
          <li className="item">
            <a href="/">
              <img src="images/flickr/02.jpg" alt="img-missing" className="img-fluid" target="_blank" />
            </a>
          </li>
          <li className="item">
            <a href="/">
              <img src="images/flickr/03.jpg" alt="img-missing" className="img-fluid" target="_blank" />
            </a>
          </li>
          <li className="item">
            <a href="/">
              <img src="images/flickr/04.jpg" alt="img-missing" className="img-fluid" target="_blank" />
            </a>
          </li>
          <li className="item">
            <a href="/">
              <img src="images/flickr/05.jpg" alt="img-missing" className="img-fluid" target="_blank" />
            </a>
          </li>
          <li className="item">
            <a href="/">
              <img src="images/flickr/06.jpg" alt="img-missing" className="img-fluid" target="_blank" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
