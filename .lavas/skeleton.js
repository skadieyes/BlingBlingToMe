import Vue from 'vue';

import Skeleton from '/Users/cat.mul/Code/lavas/blingblingaaa/core/Skeleton.vue';


export default new Vue({
    components: {
        
        Skeleton,
        
    },
    template: `
        <div>
            
            <skeleton id="skeleton" style="display:none"/>
            
        </div>
    `
});
