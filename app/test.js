var nodegit = require('nodegit');
var path = require('path');

nodegit.Repository.open(path.resolve(__dirname, "../repositories/justin/test"))
.then(function(repo) {
  return nodegit.Diff.indexToWorkdir(repo, null, {flags: nodegit.Diff.LINE.CONTEXT});
})
.done(function(diff) {
    console.log(diff);
    diff.patches().then(patches => {
        var patch = patches[0];
        console.log(patch.newFile().path());
        console.log(patch.oldFile().path());
        patch.hunks().then(hunks => hunks.forEach(hunk => {
            console.log(hunk.oldStart());
            console.log(hunk.oldLines());
            console.log(hunk.newStart());
            console.log(hunk.newLines());
            console.log(hunk.header());
            console.log(hunk.headerLen());
            hunk.lines().then(lines => {
                console.log(lines);
                lines.forEach(line => {
                    console.log(line.content());
                    console.log(String.fromCharCode(line.origin()));
                    console.log(line.oldLineno())
                    console.log(line.newLineno())
                })
            });
        }));
    });

    
});

// diff.patches().then(function(patches) {
//       patches.forEach(function(patch) {
//         patch.hunks().then(function(hunks) {
//           hunks.forEach(function(hunk) {
//             hunk.lines().then(function(lines) {
//               console.log("diff", patch.oldFile().path(),
//                 patch.newFile().path());
//               console.log(hunk.header().trim());
//               lines.forEach(function(line) {
//                 console.log(String.fromCharCode(line.origin()) +
//                   line.content().trim());
//               });
//             });
//           });
//         });
//       });
//     });