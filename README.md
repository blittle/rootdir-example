# Setup

Run `./setup.sh`

Notice that the error is really unhelpful. It is actually erroring out
on resolving `lwc`. If you install `npm install lwc` within the
`my-dependency` directory, it will then properly build, but then fail at
runtime because two versions of LWC are within the output bundle.
