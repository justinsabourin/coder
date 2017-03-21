import React from 'react';
import { Link } from 'react-router';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';

const ProjectList = (props) => {
    return <div className="projects-container">
        <GridList cols={4} padding={15} className="grid-list">
            {props.projects.map((project) => (
                <GridTile
                className="tile"
                cols={2}
                key={project.project_name}
                title={project.project_name}
                titleStyle={{color: 'black', fontFamily: 'Indie Flower', fontSize: '1.8em'}}
                titleBackground="rgba(0, 188, 212, 0.4)"
                subtitle={<span style={{color: 'black', fontFamily: 'Indie Flower', fontSize: '1.2em'}}>by <b>{project.creator}</b></span>}
                actionIcon={<IconButton containerElement={<Link to={'/' + project.project_name}/>} iconStyle={{color: 'black'}} iconClassName="fa fa-code"></IconButton>}
                >
                <iframe style={{height: '100%', width: '100%', overflow: 'hidden'}} sandbox="allow-scripts allow-same-origin" scrolling="no" src={`/staticcontent/user/${project.creator}/projects/${project.project_name}/`} frameBorder="0"></iframe>
                </GridTile>
            ))}
        </GridList>
    </div>
}

export default ProjectList;