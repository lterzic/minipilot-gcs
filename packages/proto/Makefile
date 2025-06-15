PROTOC := ../../external/minipilot-proto/lib/protoc
PLUGIN := ../../node_modules/.bin/protoc-gen-ts_proto
SRC_DIR := ../../external/minipilot-proto/src
OUT_DIR := ./gen

SRCS := $(shell find $(SRC_DIR)/mp -name '*.proto')

.PHONY: build
build: clean
	@mkdir $(OUT_DIR)
	@$(PROTOC) \
		--plugin=$(PLUGIN) \
		--ts_proto_opt=outputIndex=true \
		--ts_proto_opt=esModuleInterop=true \
		--ts_proto_opt=importSuffix=.js \
		--ts_proto_out=$(OUT_DIR) \
		-I=$(SRC_DIR) \
		$(SRCS)

.PHONY: clean
clean:
	@rm -rf $(OUT_DIR)