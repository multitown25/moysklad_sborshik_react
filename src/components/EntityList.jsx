import React from 'react'
import EntityItem from './EntityItem'

export default function EntityList({entities, title}) {
    return (
        <div>
            <h2>{title}</h2>
            {entities.map( (entity, index) => {
                return <EntityItem entity={entity} key={entity.id} index={index}/>
            })}
        </div>
    )
}
