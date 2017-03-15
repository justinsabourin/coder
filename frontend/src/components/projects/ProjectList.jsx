import React from 'react';
import { Link } from 'react-router';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';

const ProjectList = (props) => {
    return <div className="projects-container">
        <GridList className="grid-list">
            {props.projects.map((project) => (
                <GridTile
                key={project.project_name}
                title={project.project_name}
                subtitle={<span>by <b>{project.creator}</b></span>}
                actionIcon={<IconButton containerElement={<Link to={'/' + project.project_name}/>} iconStyle={{color: 'white'}} iconClassName="fa fa-folder-open"></IconButton>}
                >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/63/Code_vmc2015.png"/>
                </GridTile>
            ))}
        </GridList>
    </div>
}

export default ProjectList;