import {struct, superstruct} from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'
import isUrl from 'is-url'

import uuidv4 from 'uuid/v4';

/*
TODO --> user, chapters, element, project, uuid, url, question, answer, chapterLight, tocItem, content (types)
 */


const struct = superstruct({
    types: {
        email: value => isEmail(value) && value.length < 256,
        uuid: value => isUuid.v4(value),
        displayName: value => typeof value === string && value.length > 3,
        url: value => isUrl(value)

    },
})

const Chapter = struct({

})

const User = struct({
    name: 'displayName',
    id: 'uuid'
})

const Element = struct({
    id: 'uuid',
    type: 'number',
    content: 'object'
}, {
    id: uuidv4()
})