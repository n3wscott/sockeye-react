# IF your sockeye source directory lives in the same parent directory as sockeye-react
# then you can use this makefile to build sockeye-react and update the static contents of sockeye
update-sockeye:
	@cd ../sockeye/cmd/sockeye/kodata && rm -rf www 
	@react-scripts build && mv build www && mv www ../sockeye/cmd/sockeye/kodata/

