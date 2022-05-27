import { Text, Stack, Box } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number; //será opcional, por padrão será 10
  currentPage?: number; // opcional, por padrão será 1
  onPageChange: (page: number) => void;
}

const siblingsCount = 1 // páginas irmãs, será qnts pag pro lado direito e esquerdo, 4 5 6

function generatePagesArray(from: number, to:number) {
  return [...new Array(to - from)].map((_, index) => {
    return from +index + 1;
  }).filter(page => page > 0)
}

export function Pagination({
  totalCountOfRegisters,
  registersPerPage = 10, 
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage)
  const previousPages = currentPage > 1 //quais são as páginas que devem ser mostradas antes da atual
    ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
    : [] 
  
  const nextPages = currentPage < lastPage //quais são as páginas que devem ser mostradas dps da atual
    ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
    : []

  return (
    <Stack
      direction={["column", "row"]}
      spacing="6"
      mt="8"
      justify="space-between"
      align="center"
    >
      <Box>
        <strong>
          {currentPage * registersPerPage - registersPerPage + 1}
        </strong> - <strong> 
          {currentPage === lastPage 
          ? totalCountOfRegisters 
          : registersPerPage * currentPage}
        </strong> de <strong>{totalCountOfRegisters}</strong>     
      </Box>
      <Stack direction="row" spacing="2">

        {currentPage > (1 + siblingsCount) && (
          <>
            <PaginationItem onPageChange={onPageChange} number={1} />
            { currentPage > (2 + siblingsCount) && (
              <Text color="gray.300" width="8" textAlign="center" >...</Text>
            )}
          </>
        )}

        {previousPages.length > 0 && previousPages.map(page =>{
          return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
        })}

        <PaginationItem onPageChange={onPageChange} number={currentPage} isCurrent />

        {nextPages.length > 0 && nextPages.map(page =>{
          return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
        })}

        {(currentPage + siblingsCount) < lastPage && (
          <>
            { (currentPage + siblingsCount) < lastPage && (
              <Text color="gray.300" width="8" textAlign="center" >...</Text>
            )}
            <PaginationItem onPageChange={onPageChange} number={lastPage} />
          </>
        )}

      </Stack>
    </Stack>
  );
}

