# p4-local-review


### Why?
Perforce provides a program called Helix Swarm which by all appearances does what this does, better. Unfortunately it has to be set up on your server (which has to be Ubuntu/Redhat) or on a VM and it's kind of annoying. We have all the data we need on our machines, so we should be able to diff without a server.

The Perforce client does have a good diffing tool, however you have to open the diff for each file individually, often going through a few 1 line file changes before finding any meaningful changes. 

## To build
run `npm install`
and then `npm start`

### To use

For this to work you'll need to have the p4port and p4user variables set correctly and be logged in via the p4 cli. 
To set, use `p4 set [variable] [value]`. Port actually is `ipaddress:port`, which is confusing. Thanks perforce. You might also need to set up a client view, which you do by running `p4 client` and then pressing the right buttons

Once started, click any of the changelist items to get an expanded diff view.

Note: I didn't write diff2html. I could have bower installed it, but I wasn't about to use webpack or anything like that and I couldn't be bothered so it's just there
