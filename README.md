# p4-local-review

## To build
run `npm install`
and then `npm start`

### To use

Click any of the changelist items to get an expanded diff view

For this to work you'll need to have the p4port and p4user variables set correctly and be logged in via the p4 cli. 
To set, use `p4 set [variable] [value]`. Port actually is `ipaddress:port`, which is confusing. Thanks perforce. You might also need to set up a client view, which you do by running `p4 client` and then pressing the right buttons



Note: I didn't write diff2html. I could have bower installed it, but I wasn't about to use webpack or anything like that and I couldn't be bothered so it's just there
